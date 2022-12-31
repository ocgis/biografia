# frozen_string_literal: true

Biografia::Application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }

  namespace :api do
    namespace :v1 do
      resources :people, only: %i[index show create update destroy] do
        member do
          get :examine
        end
      end
      resources :notes, only: %i[index show create update destroy] do
        member do
          get :examine
        end
      end
      resources :media, only: %i[index show destroy] do
        collection do
          get :file_thumb
          get :search
          post :register
        end
        member do
          get :examine
          get :image
          get :thumb
        end
      end
      resources :events, only: %i[index show create update destroy] do
        member do
          get :examine
        end
      end
      resources :event_dates, only: %i[show create update destroy] do
        member do
          get :examine
        end
      end
      resources :addresses, only: %i[index show create update destroy] do
        member do
          get :examine
        end
      end
      resources :things, only: %i[index show create update destroy] do
        member do
          get :examine
        end
      end
      resources :relationships, only: %i[show create update destroy] do
        member do
          get :examine
        end
      end
      resources :transfers, only: %i[create index show]
      resources :exports, only: %i[index show create] do
        collection do
          get :file
        end
      end
      resources :users, only: %i[index show]
      resources :references, only: %i[create update destroy] do
        collection do
          get :list
        end
      end
    end
  end

  resources :sessions, only: [:new]

  scope '/legacy' do
    resources :addresses do
      collection do
        post 'createp'
        get 'newp'
      end

      member do
        get 'delete'
        get 'examine'
        get :selmerge
        post :edmerge
        patch :domerge
      end
    end

    resources :event_dates, except: %i[create new] do
      collection do
        post 'createp'
        get 'newp'
      end

      member do
        get 'delete'
        get 'examine'
      end
    end

    resources :events do
      collection do
        post 'createp'
        get 'newp'
      end

      member do
        get 'delete'
        get 'examine'
      end
    end

    resources :exports, only: %i[index new create show] do
      member do
        get 'status'
        get 'file'
      end
    end

    resources :home, only: [] do
      collection do
        post 'goto'
      end
    end

    resources :imports, only: %i[new show] do
      member do
        get 'status'
      end
    end

    resources :media, except: [:update] do
      collection do
        get 'register'
        get 'search'
        get 'show_file'
        get 'file_image'
        get 'file_thumb'
      end

      member do
        get 'examine'
        get 'delete'
        get 'showp'
        get 'tag'
        get 'image'
        get 'thumb'
      end
    end

    resources :notes, except: %i[create new] do
      collection do
        post 'createp'
        get 'newp'
      end

      member do
        get 'delete'
        get 'examine'
      end
    end

    resources :people do
      collection do
        post 'createp'
        get 'newp'
      end

      member do
        get 'ancestry'
        get 'delete'
        get 'examine'
      end
    end

    resources :references, only: [:destroy] do
      collection do
        get  'connection_add'
        post 'connection_add'
        get  'connection_choose'
        get  'connection_list'
      end

      member do
        get  'delete'
      end
    end

    resources :relationships, except: %i[create new] do
      collection do
        post 'createp'
        get 'newp'
      end

      member do
        get 'delete'
        get 'examine'
      end
    end

    resources :things do
      collection do
        post 'createp'
        get 'newp'
      end

      member do
        get 'delete'
        get 'examine'
      end
    end

    resources :transfers, only: %i[create new index show]
    resources :users, only: %i[index show edit update]

    get '/' => 'public#home'
  end

  root to: 'react#entry'

  get '/*path' => 'react#entry'
end
