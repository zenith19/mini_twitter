Rails.application.routes.draw do
  namespace :v1, defaults: { format: :json } do
    resources :posts do
      resources :comments, only: %i[index]
    end
    resources :sessions, only: %i[create destroy]
    resources :users do
      resources :posts, only: %i[index], controller: 'user_posts'
    end
    resources :comments, only: %i[create]
    resources :user_followings, only: %i[show create destroy]
    resources :user_followers, only: %i[show]
  end
end
