class TransferDecorator < Draper::Decorator
  delegate_all

  def one_line
    return file_name
  end

end
