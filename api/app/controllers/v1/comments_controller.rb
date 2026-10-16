module V1
  class CommentsController < ApplicationController
    before_action :authenticate_user!, except: :index

    # GET /v1/posts/:post_id/comments
    def index
      post = Post.find(params[:post_id])
      comments = paginate(post.comments.newest_first.includes(:user))
      render json: comments, meta: pagination_meta(comments), status: :ok
    end

    # POST /v1/comments
    def create
      comment = current_user.comments.build(comment_params)

      if comment.save
        render json: comment, status: :created
      else
        # The failure branch used to render status: :created.
        unprocessable(comment)
      end
    end

    # PATCH/PUT /v1/comments/:id
    def update
      comment = current_user.comments.find(params[:id])

      if comment.update(comment_params.slice(:content))
        render json: comment, status: :ok
      else
        unprocessable(comment)
      end
    end

    # DELETE /v1/comments/:id
    def destroy
      current_user.comments.find(params[:id]).destroy!
      head :no_content
    end

    private

    def comment_params
      params.require(:comment).permit(:content, :post_id)
    end
  end
end
