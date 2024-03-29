# frozen_string_literal: true

set :application, 'biografia'
set :repo_url, 'git@github.com:ocgis/biografia.git'

set :linked_files, %w[config/database.yml app/javascript/components/Config.jsx]
set :linked_dirs, %w[log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system protected]

namespace :deploy do
  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      execute :touch, release_path.join('tmp/restart.txt')
    end
  end

  after :publishing, 'deploy:restart'
  after :finishing, 'deploy:cleanup'
end
