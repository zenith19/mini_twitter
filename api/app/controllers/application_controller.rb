class ApplicationController < ActionController::API
  include Authenticatable

  # The controllers used to call Model.find directly, so a missing record
  # surfaced as an unhandled exception rather than a 404.
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActionController::ParameterMissing, with: :bad_request

  private

  def not_found
    render json: { error: 'Not found' }, status: :not_found
  end

  def bad_request(exception)
    render json: { error: exception.message }, status: :bad_request
  end

  def unprocessable(record)
    render json: { errors: record.errors.as_json(full_messages: true) },
           status: 422
  end

  # Shared pagination for the index endpoints, which previously returned
  # every row via Model.all.
  def paginate(scope)
    scope.page(params[:page]).per(per_page)
  end

  def per_page
    [[params.fetch(:per_page, 25).to_i, 1].max, 100].min
  end

  def pagination_meta(collection)
    {
      current_page: collection.current_page,
      total_pages: collection.total_pages,
      total_count: collection.total_count,
      per_page: collection.limit_value
    }
  end
end
