<h1>lets-play-chess</h1>
<p>App for playing chess just by sending a link.</p>
<h2>Description</h2>
<p>This app highlights the legal moves to be played and validates that the player sent a legal move before updating the board.</p>
<h2>Why</h2>
<p>I was thinking about how someone might go about structuring a board and its pieces. I started with a few tests and eventually ended up with a whole working board.</p>
<h2>Website</h2>
<p>A live version of the site can be found at <a href="https://react-chess-smoky.vercel.app/">lets-play-chess</a>.</p>
<h2>Usage</h2>
<p>1. Click Create Game</p>
<p>2. Send link to opponent and wait for them to join.</p>
<p>3. By default the creator of the game is white, but team colors can be swapped before a game begins.</p>
<p>4. Once you and your opponent are ready click to begin the game.</p>
<p>5. Click a piece to see its possible moves, click an empty space if you wish to dehighlight moves.</p>
<h3>Important Notes</h3>
<p>1. You may refresh your tab if an issue is occuring, but do not close the tab. Your user id is stored in session storage to make sure when a move is played it is coming from the correct person and not a cheater. Rejoining the link will open up as a spectator.</p>
<p>2. Special rules: Moves like en passant and castling are implemented, however stalling out for a draw is not.</p>
