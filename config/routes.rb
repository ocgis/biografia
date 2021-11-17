# frozen_string_literal: true

Biografia::Application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }

  namespace :api do
    namespace :v1 do
      resources :people, only: %i[index show create update]
      resources :notes, only: %i[show create update]
      resources :media, only: %i[index show] do
        collection do
          get :search
          post :register
        end
      end
      resources :events, only: %i[index show create update]
      resources :event_dates, only: %i[show create update]
      resources :addresses, only: %i[index show create update]
      resources :things, only: %i[index show create update]
      resources :relationships, only: %i[show create update]
      resources :transfers, only: %i[index show]
      resources :exports, only: %i[index show] do
        collection do
          get :file
        end
      end
      resources :users, only: %i[index show]
      resources :references, only: %i[create destroy] do
        collection do
          get :list
        end
      end
    end
  end

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

  resources :sessions, only: [:new]
  resources :transfers, only: %i[create new index show]
  resources :users, only: %i[index show edit update]

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  root to: 'public#home'

  get '/*path' => 'react#entry'
end
