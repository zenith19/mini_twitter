# Token authentication for the v1 API.
#
# Replaces the `authenticate` method that was copy-pasted into five
# controllers. That version read a bare `token` header, called
# `.delete_suffix('nil')` on it (raising NoMethodError — a 500 — when the
# header was absent), and compared `user.ids.first` (Integer) against
# `params[:user_id]` (String), so the ownership check never actually matched.
module Authenticatable
  extend ActiveSupport::Concern

  included do
    attr_reader :current_user
  end

  private

  # Rejects the request with 401 unless a valid bearer token is present.
  def authenticate_user!
    @current_user = User.find_by_authentication_token(bearer_token)
    return if @current_user

    render json: { error: 'Unauthorized' }, status: :unauthorized
  end

  # Sets current_user when a token is present but never rejects the request.
  # Used by endpoints that are public but render extra fields when signed in.
  def authenticate_user
    @current_user = User.find_by_authentication_token(bearer_token)
  end

  def user_signed_in?
    current_user.present?
  end

  # Accepts the standard `Authorization: Bearer <token>` header.
  def bearer_token
    header = request.headers['Authorization']
    return nil if header.blank?

    header[/\ABearer\s+(.+)\z/i, 1]
  end
end
