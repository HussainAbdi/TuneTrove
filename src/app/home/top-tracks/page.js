"use client";

import { useState, useEffect } from "react";
import { getTopTracks, getCurrentUserID, createPlaylist, profileType } from "@/app/home/spotify";
import { catchErrors } from "@/app/home/utils";
import { SectionWrapper, TrackList, TimeRangeButtons, Loader} from "@/components";
import StyledPlaylistButton from "@/styles/StyledPlaylistButton";


const topTracks = () => {
  const [topTracks, setTopTracks] = useState(null);
  const [timeRange, setTimeRange] = useState('short');
  const [userID, setUserID] = useState(null);
  
  const [playlistURIs, setPlaylistURIs] = useState({
    short: null,
    medium: null,
    long: null
  });
  const [createButtonsVisible, setCreateButtonsVisible] = useState({
    short: true,
    medium: true,
    long: true
  });
  const [openButtonsVisible, setOpenButtonsVisible] = useState({
    short: false,
    medium: false,
    long: false
  });
  
  useEffect(() => {
    const fetchData = async () => {
      const userTopTracks = await getTopTracks(`${timeRange}_term`, 50);
      setTopTracks(userTopTracks.data);
      const id = await getCurrentUserID();
      setUserID(id);
    }

    catchErrors(fetchData());
  }, [timeRange]);

  const handleCreatePlaylist = async () => {
    try{
      setCreateButtonsVisible((prevButtonsVisible) => ({
        ...prevButtonsVisible,
        [timeRange]: false
      }));
      
      const playlist = await createPlaylist(userID, topTracks.items.map((track) => track['uri']), timeRange);
      setPlaylistURIs((prevPlaylistURIs) => ({
        ...prevPlaylistURIs,
        [timeRange]: playlist.data.uri
      }));
      
      setOpenButtonsVisible((prevButtonsVisible) => ({
        ...prevButtonsVisible,
        [timeRange]: true
      }));
    } catch (error) {
      console.log('Error handling create playlist: ', error);
    }
  }

  return (
    <main>
      <SectionWrapper title="Top Tracks" breadcrumb="true">
        {profileType.token && (
          <StyledPlaylistButton>
            {createButtonsVisible[timeRange] && userID && topTracks && !playlistURIs[timeRange] && (
                <button onClick={handleCreatePlaylist}>
                  Create Playlist
                </button>
            )}
            {!createButtonsVisible[timeRange] && !openButtonsVisible[timeRange] && (
              <button>
                <Loader button="true"/>
              </button>
            )}
            {openButtonsVisible[timeRange] && (
              <a href={playlistURIs[timeRange]}><button>Open Playlist</button></a>
            )}
          </StyledPlaylistButton>
        )}
        <TimeRangeButtons timeRange={timeRange} setTimeRange={setTimeRange} />
        {topTracks ? (
          <TrackList tracks={topTracks.items} />
        ) : (
          <Loader />
        )}
      </SectionWrapper>
    </main>
  )
};

export default topTracks;