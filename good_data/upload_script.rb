# encoding: UTF-8
# 30 Days of Automation: GoodData Ruby SDK
# Visit http://sdk.gooddata.com/gooddata-ruby/ for Tutorials, Examples, and Support.

require 'rubygems'
require 'gooddata'

AUTH_TOKEN = 'ONBDIS852d718ca'

# GoodData.logging_on

GoodData.with_connection('jtsmith0107@gmail.com', 'georgeisathief') do |c|
  blueprint = GoodData::Model::ProjectBlueprint.build("Sentiments-Youtube-3") do |p|

    p.add_dataset('users') do |d|
      d.add_attribute('name')
      d.add_attribute('comment') #128 length?
      d.add_attribute('timestamp')
      d.add_attribute('language')
      d.add_attribute('context')
      d.add_fact('length', :gd_data_type => "DECIMAL(12,0)")
      d.add_fact('sentiment', :gd_data_type => "DECIMAL(2,0)")
      d.add_attribute('aggregate')
    end
        #
    # p.add_dataset('items') do |d|
    #   d.add_attribute('word')
    #   d.add_fact('score', gd_data_type: "DECIMAL(2,0)")
    # end
  end

  project = GoodData::Project.create_from_blueprint(blueprint, :auth_token => AUTH_TOKEN)
  puts "Created project #{project.pid}"

  GoodData::with_project(project.pid) do |p|
    # Load data
    GoodData::Model.upload_data('youtube-data.csv', blueprint, 'users')
    # GoodData::Model.upload_data('./word-data.csv', blueprint, 'items')
# create a metric
    # metric1 = p.fact('fact.users.score').create_metric(:type => :avg) # uses sum by default, sdk for avg.
    # metric2 = p.fact('fact.users.length').create_metric(:type => :avg)
    # metric1.save
    #
    #
    # report = p.create_report(title: 'Awesome_report', top: [metric2])
    # report.save

  end
end
