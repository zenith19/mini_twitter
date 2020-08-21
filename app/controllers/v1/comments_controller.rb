class V1::CommentsController < ApplicationController
	def index
		comments = Comment.all
		
		render json: comments, status: :ok		
	end

	def show
		comment = Comment.find(params[:id])

		render json: comment, status: :ok
	end

	def create
		comment = Comment.new(comment_param)

		if comment.save
			render json: comment, message: "Comment Created"
		else
			render json: {error: comment.errors.messages}, status: 422
		end
	end

	def update
		comment = Comment.find(params[:id])

		if comment.update(comment_param)
			render json: comment, message: "Comment Updated",status: :ok
		else
			render json: {error: comment.errors.messages}, status: 422
		end
	end

	def destroy
		comment = Comment.find(params[:id])

		if comment.destroy
			render json: comment, message: "Comment Deleted",status: :ok
		else
			render json: {error: comment.errors.messages}, status: 422
		end
	end

	private
	def comment_param
		params.require(:comment).permit(:content,
									    :user_id,
									    :blog_id)
	end
end
