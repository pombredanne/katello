collection @collection

child :content_view_version => :content_view_version do
  attributes :name, :id, :version

  child :content_view => :content_view do
    attributes :id, :name, :label
  end
end

child :environments => :environments do
  attributes :name, :id
end

attributes :next_version, :content_host_count
