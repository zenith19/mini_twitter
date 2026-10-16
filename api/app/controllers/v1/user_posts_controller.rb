module V1
  class UserPostsController < ApplicationController
    # GET /v1/users/:user_id/posts
    def index
      user = User.find(params[:user_id])
      posts = paginate(user.posts.newest_first.includes(:user))
      render json: posts, meta: pagination_meta(posts), status: :ok
    end
  end
end
