module V1
  class SessionsController < ApplicationController
    before_action :authenticate_user!, only: :destroy

    # POST /v1/sessions
    # Returns the plaintext token exactly once; only its digest is stored.
    def create
      user = User.find_by(email: params[:email].to_s.downcase)

      if user&.valid_password?(params[:password])
        token = user.issue_authentication_token!
        render json: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          authentication_token: token
        }, status: :created
      else
        # Previously returned 200 OK with a message, so the client could not
        # distinguish a failed login from a successful one by status alone.
        render json: { error: 'Invalid email or password' }, status: :unauthorized
      end
    end

    # DELETE /v1/sessions
    def destroy
      current_user.revoke_authentication_token!
      head :no_content
    end
  end
end
