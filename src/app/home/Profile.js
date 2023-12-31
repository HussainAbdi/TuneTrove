import { useState, useEffect } from "react";
import { getCurrentUserProfile, getCurrentUserPlaylists, getTopArtists, getTopTracks } from "@/app/home/spotify";
import { StyledHeader, StyledLoginButton} from "@/styles";
import { ArtistsGrid, PlaylistsGrid, SectionWrapper, TrackList, Loader } from "@/components";
import { logoutEverywhere } from "@/app/home/spotify";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [topTracks, setTopTracks] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await getCurrentUserProfile();
      //console.log(userProfile);
      setProfile(userProfile.data);
      
      const userPlaylists = await getCurrentUserPlaylists();
      //console.log(userPlaylists);
      setPlaylists(userPlaylists.data);

      const userTopArtists = await getTopArtists();
      //console.log(userTopArtists);
      setTopArtists(userTopArtists.data);

      const userTopTracks = await getTopTracks();
      //console.log(userTopTracks.data);
      setTopTracks(userTopTracks.data);
    };

    fetchData().catch((error) => {
      console.log("Fetch Data Error: ", error)
      setError(error)
    });

  }, []);

  if (error?.response.status === 403){
    return (
      <div style={{display: "flex", height: "100vh", justifyContent: "center", alignItems: "center"}}>
        <p style={{textAlign: "center"}}>
            Looks like you don't have early access on this account!<br />
            Fear not, click the button below to log out from Spotify and try a different account.<br />
            <br />
            <StyledLoginButton onClick={logoutEverywhere}>Log out everywhere</StyledLoginButton>
        </p>
      </div>
    )
  } 

  return (
    <>
      {profile && (
        <StyledHeader type="user">
          <div className="header__inner">
            {profile.images.length && profile.images[1].url ? (
              <img className="header__img" src={profile.images[1].url} alt="Avatar" />
            ): null}
            <div>
              <div className="header__overline">Profile</div>
              <h1 className="header__name">{profile.display_name}</h1>
              <p className="header__meta">
                {playlists && (
                  <span>
                    {playlists.total} Playlist{playlists.total !== 1 ? 's': ''}
                  </span>
                )}
                <span>
                  {profile.followers.total} Follower{profile.followers.total !== 1 ? 's': ''}
                </span>
              </p>
            </div>
          </div>
        </StyledHeader>
      )}

      {topArtists && topTracks && playlists ? (
        <main>
          <SectionWrapper title="Top artists this month" seeAllLink="/home/top-artists">
            <ArtistsGrid artists={topArtists.items.slice(0, 10)} />
          </SectionWrapper>

          <SectionWrapper title="Top tracks this month" seeAllLink="/home/top-tracks">
            <TrackList tracks={topTracks.items.slice(0, 10)} />
          </SectionWrapper>

          <SectionWrapper title="Public playlists" seeAllLink="/home/playlists">
            <PlaylistsGrid playlists={playlists.items.slice(0, 10)} />
          </SectionWrapper>
        </main>
      ): (
        <Loader />
      )}
    </>
  )
};

export default Profile;