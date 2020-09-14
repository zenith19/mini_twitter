class V1::CommentsController < ApplicationController 
  # before_action :authenticate
  def index
    comments = Comment.where(post_id: params[:post_id])

    render json: comments, status: :ok
  end

  def create
    comment = Comment.new(comment_param)

    if comment.save
      render json: comment, message: 'Comment Created', status: 201
    else
      render json: { error: comment.errors.messages }, status: :created
    end
  end

  def update
    comment = Comment.find(params[:id])

    if comment.update(comment_param)
      render json: comment, message: 'Comment Updated', status: :ok
    else
      render json: { error: comment.errors.messages }, status: 422
    end
  end

  def destroy
    comment = Comment.find(params[:id])

    if comment.destroy
      render json: comment, message: 'Comment Deleted', status: :ok
    else
      render json: { error: comment.errors.messages }, status: 422
    end
  end

  private

  def comment_param
    params.require(:comment).permit(:content, :post_id, :user_id)
  end

  def authenticate
    token = request.headers['token'].delete_suffix('nil')
    user = User.where(authentication_token: token)
    if user.empty? || user.ids.first != params[:user_id]
      render json: 'unauthorized', status: :unauthorized
    end
  end
end
