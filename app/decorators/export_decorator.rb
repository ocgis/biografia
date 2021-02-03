class ExportDecorator < Draper::Decorator
  delegate_all

  def one_line
    return "#{file_name} (#{content_type})"
  end

end
