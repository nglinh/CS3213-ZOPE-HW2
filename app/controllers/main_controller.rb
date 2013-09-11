

class MainController < ApplicationController
require 'uri'
require 'net/http'

PROVIDER = 'https://cs3213.herokuapp.com'
APP_ID = '38313a31bcc76429957ba97fdd2b9404'
APP_SECRET = 'fd9338dab2c23e99bde73b649458a11a'
CALL_BACK_URL = "http://localhost:3000/callback"

def index

end

def login
	redirect_to "#{PROVIDER}/oauth/new?client_id=#{APP_ID}&redirect_uri=#{CALL_BACK_URL}"
end

def callback
	token = params[:code]
	url = "#{PROVIDER}/oauth/token.json?client_id=#{APP_ID}&client_secret=#{APP_SECRET}&code=#{token}"
	
	respond = http_request(url)
	
	access_token = parse_token(respond.body)
	session[:access_token] = access_token
	redirect_to '/index'
end

private
def http_request(url)
	uri = URI.parse(url)
	http = Net::HTTP.new(uri.host,uri.port)
	http.use_ssl = true
	http.verify_mode = OpenSSL::SSL::VERIFY_NONE

	request = Net::HTTP::Post.new(uri.request_uri)
	respond=http.request(request)
end

def parse_token(respond_body)
	access_token_string = respond_body.split(',').first.split(':').last
	access_token = access_token_string[1,access_token_string.length-2]
end

end
