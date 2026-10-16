class V1::PostsController < ApplicationController 
  before_action :authenticate, except: [:index, :show]
  def index
    posts = Post.all

    render json: posts, status: 200
  end

  def show
    post = Post.find(params[:id])

    render json: post, status: 200
  end

  def create
    post = Post.new(post_param)

    if post.save
      render json: post, message: 'Post Created', status: 201
    else
      render json: { error: post.errors.messages }, status: 422
    end
  end

  def update
    post = Post.find(params[:id])

    if post.update(post_param)
      render json: post, message: 'Post Updated', status: :ok
    else
      render json: { error: post.errors.messages }, status: 422
    end
  end

  def destroy
    post = Post.find(params[:id])

    if post.destroy
      render json: post, message: 'Post Deleted', status: :ok
    else
      render json: { error: post.errors.messages }, status: 422
    end
  end

  private

  def post_param
    params.require(:post).permit(:title, :content, :user_id)
  end

  def authenticate
    token = request.headers['token'].delete_suffix('nil')
    user = User.where(authentication_token: token)
    if user.empty? || user.ids.first != params[:user_id]
      render json: 'unauthorized', status: :unauthorized
    end
  end
end
