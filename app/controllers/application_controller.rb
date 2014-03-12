class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def find_by_object_name(object_name)
    a = object_name.split(':')
    if a.length != 2
      raise StandardError
    end
    return Kernel.const_get(a[0]).find(a[1].to_i)
  end
end
