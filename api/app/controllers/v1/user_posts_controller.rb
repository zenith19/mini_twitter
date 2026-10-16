class V1::UserPostsController < ApplicationController 
  # before_action :authenticate

  def index
    posts = Post.where(user_id: params[:user_id])
    
    render json: posts, status: :ok
  end

  private
  def authenticate
    token = request.headers['token'].delete_suffix('nil')
    user = User.where(authentication_token: token)
    if user.empty? || user.ids.first != params[:user_id]
      render json: 'unauthorized', status: :unauthorized
    end
  end
end
