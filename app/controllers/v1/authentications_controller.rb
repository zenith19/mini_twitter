class V1::AuthenticationsController < ApplicationController
	def show
		authentication = Authentication.find[:id]
	end

	private
	def authentication_param
		params.require(:authentication).permit(:user_name, :password)
	end
end
