class V1::UsersController < ApplicationController
	def index
		users = User.all
		
		render json: users, status: :ok		
	end

	def show
		user = User.find(params[:id])

		render json: user, status: :ok
	end

	def create
		user = User.new(user_param)

		if user.save
			render json: user, message: "User Created"
		else
			render json: {error: user.errors.messages}, status: 422
		end
	end

	def update
		user = User.find(params[:id])

		if user.update(user_param)
			render json: user, message: "User Updated",status: :ok
		else
			render json: {error: user.errors.messages}, status: 422
		end
	end

	def destroy
		user = User.find(params[:id])

		if user.destroy
			render json: user, message: "User Deleted",status: :ok
		else
			render json: {error: user.errors.messages}, status: 422
		end
	end

	private
	def user_param
		params.require(:user).permit(:first_name, 
									 :last_name,
									 :email,
									 :age,
									 :country)
	end
end
