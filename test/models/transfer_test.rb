require 'test_helper'

class TransferTest < ActiveSupport::TestCase
  test "Transfer must have file_name" do
    transfer = Transfer.new
    transfer.content_type = 'text/plain'
    transfer.file_name = nil
    refute transfer.save, "Transfer was saved without file_name"
  end  

  test "Transfer must have content_type" do
    transfer = Transfer.new
    transfer.content_type = nil
    transfer.file_name = 'apa'
    refute transfer.save, "Transfer was saved without content_type"
  end  

  test "Transfer can be saved" do
    transfer = Transfer.new
    transfer.content_type = 'text/plain'
    transfer.file_name = 'apa'
    assert transfer.save, "Transfer was not saved"
  end
end
