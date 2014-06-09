class PositionInPicture < ActiveRecord::Base
  has_paper_trail

  belongs_to :reference
end
