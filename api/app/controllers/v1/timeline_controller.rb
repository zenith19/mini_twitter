module V1
  # GET /v1/timeline
  #
  # The signed-in user's home feed. /v1/posts remains the public "everything"
  # list; this is the one the follow graph actually drives.
  class TimelineController < ApplicationController
    before_action :authenticate_user!

    def show
      posts = paginate(current_user.timeline_posts.newest_first.includes(:user))
      render json: posts, meta: pagination_meta(posts), status: :ok
    end
  end
end
