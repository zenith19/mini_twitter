module V1
  class UserFollowersController < ApplicationController
    before_action :authenticate_user

    # GET /v1/users/:user_id/followers
    def show
      user = User.find(params[:user_id])
      users = paginate(user.followers.order(:id))
      render json: users, meta: pagination_meta(users), scope: current_user, status: :ok
    end
  end
end
