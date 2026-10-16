Rails.application.routes.draw do
  namespace :v1, defaults: { format: :json } do
    # Sessions are identified by the bearer token, not by an id in the path.
    post   'sessions', to: 'sessions#create'
    delete 'sessions', to: 'sessions#destroy'

    resources :users, only: %i[index show create] do
      resources :posts, only: %i[index], controller: 'user_posts'
      resource  :followings, only: %i[show], controller: 'user_followings'
      resource  :followers,  only: %i[show], controller: 'user_followers'
    end

    resources :posts, only: %i[index show create update destroy] do
      resources :comments, only: %i[index]
    end

    resources :comments, only: %i[create update destroy]

    # :id here is the id of the user being unfollowed.
    resources :user_followings, only: %i[create destroy]
  end

  get 'up', to: 'rails/health#show', as: :rails_health_check
end
