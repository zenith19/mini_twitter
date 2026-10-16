# Throttling. The login endpoint previously accepted unlimited password
# attempts from a single address.
class Rack::Attack
  throttle('logins/ip', limit: 10, period: 1.minute) do |req|
    req.ip if req.path == '/v1/sessions' && req.post?
  end

  throttle('logins/email', limit: 5, period: 5.minutes) do |req|
    if req.path == '/v1/sessions' && req.post?
      req.params['email'].to_s.downcase.presence
    end
  end

  throttle('signups/ip', limit: 5, period: 1.hour) do |req|
    req.ip if req.path == '/v1/users' && req.post?
  end

  throttle('api/ip', limit: 300, period: 5.minutes) { |req| req.ip }

  self.throttled_responder = lambda do |request|
    retry_after = (request.env['rack.attack.match_data'] || {})[:period]
    [429,
     { 'Content-Type' => 'application/json', 'Retry-After' => retry_after.to_s },
     [{ error: 'Too many requests. Try again later.' }.to_json]]
  end
end

Rails.application.config.middleware.use Rack::Attack unless Rails.env.test?
