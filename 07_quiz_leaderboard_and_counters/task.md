# Live Leaderboard

Using Redis methods:
1. incr
2. zincrby
3. zrevrange
4. zrevrank

# Implement Endpoints:
1. POST    -> /post/:id/view                 -> increment view count of a post
2. POST    -> /leaderboard/score             -> add points to user score
3. GET     -> /leaderboard                   -> get top 10 leaders
4. GET     -> /leaderboard/:userId/rank      -> get a rank of user