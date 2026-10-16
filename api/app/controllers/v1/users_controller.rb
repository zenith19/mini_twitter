module V1
  class UsersController < ApplicationController
    before_action :authenticate_user, only: %i[index show]

    # POST /v1/users
    def create
      user = User.new(user_params)

      if user.save
        token = user.issue_authentication_token!
        render json: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          authentication_token: token
        }, status: :created
      else
        # Used to render the bare symbol :unprocessable_entity as the body,
        # discarding the validation errors entirely.
        unprocessable(user)
      end
    end

    # GET /v1/users
    def index
      users = paginate(User.order(:id))
      render json: users,
             meta: pagination_meta(users),
             scope: current_user,
             status: :ok
    end

    # GET /v1/users/:id
    def show
      user = User.find(params[:id])
      render json: user, scope: current_user, status: :ok
    end

    private

    def user_params
      params.permit(:email, :password, :name, :username)
    end
  end
end
