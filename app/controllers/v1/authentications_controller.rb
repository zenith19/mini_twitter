class V1::AuthenticationsController < ApplicationController
	def create
		authentication = Authentication.new(authentication_param)
		if authentication.save
			render json: {"Successfull"}
	end


	def show
		authentication = Authentication.find_by(params[:user_id])
	end


	private
	def authentication_param
		params.require(:authentication).permit(:user_name, 
											   :password_digest,
											   :user_id)
	end
end
