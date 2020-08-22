class V1::UsersController < ApplicationController
	def create
		user = User.new(user_params)
		if user.save
			render json: user.to_json(only: [:email,:password, :name,:username])
		else
			render json: :unprocessable_entity
		end
	end

	private
	def user_params
		params.require(:user).permit(:email, 
									 :password,
									 :password_confirmation,
									 :name,
									 :username)
	end
end
