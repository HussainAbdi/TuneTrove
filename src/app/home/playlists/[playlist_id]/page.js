"use client";

import { getPlaylistById, getAudioFeaturesForTracks, profileType } from "@/app/home/spotify";
import { useState, useEffect, useMemo } from "react";
import { catchErrors } from "@/app/home/utils";
import { StyledHeader, StyledDropdown } from "@/styles";
import { SectionWrapper, TrackList, Loader } from "@/components";
import axios from "axios";

export default function Playlist({params}) {
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [tracksData, setTracksData] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null)
  const [sortValue, setSortValue] = useState('');
  const sortOptions = ['danceability', 'tempo', 'energy'];

  useEffect(() => {
    const fetchData = async () => {
      const {data} = await getPlaylistById(params.playlist_id);
      setPlaylist(data);
      setTracksData(data.tracks);
    }

    catchErrors(fetchData());
  }, []);

  useEffect(() => {
    if (!tracksData){
      return;
    }

    const fetchMoreData = async () => {
      if (tracksData.next && profileType.token){
        const { data } = await axios.get(tracksData.next)
        // We use data and not data.tracks here because now we have got the tracks next url which returns tracks 
        // Using data.tracks was preventing us from getting next tracks and I wasn't sure why at the time
        setTracksData(data);
      }
    }

    setTracks(tracks => ([
      ...tracks ? tracks : [],
      ...tracksData.items
    ]))

    catchErrors(fetchMoreData());

    const fetchAudioFeatures = async () => {
      const ids = tracksData.items.map(({track}) => track.id).join(',');
      const { data } = await getAudioFeaturesForTracks(ids);
      setAudioFeatures(audioFeatures => ([
        ...audioFeatures ? audioFeatures : [],
        ...data['audio_features']
      ]));
    }

    catchErrors(fetchAudioFeatures());

  }, [tracksData]);
  
  /**
   * Restructing tracks objects to get track information 
   * Then appending audio features to it
   */
  const tracksWithAudioFeatures = useMemo(() => {
    if (!tracks || !audioFeatures){
      return null;
    }
    
    return tracks.map(({track}) => {
      const trackToAdd = track;

      if (!track.audio_features){
        const audioFeaturesObj = audioFeatures.find(item => {
          if (!item || !track){
            return null;
          }
          return item.id === track.id;
        });

        trackToAdd['audio_features'] = audioFeaturesObj;
      }

      return trackToAdd;
    });
  }, [tracks, audioFeatures]);

  const sortedTracks = useMemo(() => {
    if(!tracksWithAudioFeatures){
      return null;
    }

    const tracksToReturn = [...tracksWithAudioFeatures].sort((a, b) => {
      const aFeatures = a['audio_features'];
      const bFeatures = b['audio_features'];

      if (!aFeatures || !bFeatures) {
        return false;
      }
      
      return bFeatures[sortValue] - aFeatures[sortValue];
    });

    return tracksToReturn;
  }, [sortValue, tracksWithAudioFeatures]);

  return (
    <>
      
        <StyledHeader>
          {playlist && ( 
            <div className="header__inner">
              {playlist.images.length && playlist.images[0].url ? (
                <img className="header__img" src={playlist.images[0].url} alt="Playlist Cover Art" />
              ): null}
              <div>
                <div className="header__overline">Playlist</div>
                <h1 className="header__name">{playlist.name}</h1>
                <p className="header__meta">
                  {playlist.followers.total ? (
                    <span>{playlist.followers.total} {`follower${playlist.followers.total !== 1 ? 's': ''}`}</span>
                  ): null}
                  <span>{playlist.tracks.total} {`song${playlist.tracks.total !== 1 ? 's' : ''}`}</span>
                </p>
              </div>
            </div>
          )}
        </StyledHeader>

        <main>
          <SectionWrapper title="Playlist" breadcrumb="true">
            <StyledDropdown active={sortValue}>
              <label className="sr-only" htmlFor="order-select">Sort Tracks</label>
              <select 
                name="track-order"
                id="order-select"
                onChange={e => setSortValue(e.target.value)}
              >
                <option value="">Sort tracks</option>
                {sortOptions.map((option, i) => (
                  <option value={option} key={i}>
                    {`${option.charAt(0).toUpperCase()}${option.slice(1)}`}
                  </option>
                ))}
              </select>
            </StyledDropdown>
            {sortedTracks ? (
              <TrackList tracks={sortedTracks} />
            ) : (
              <Loader />
            )}
          </SectionWrapper>
        </main>
    </>
  )
}
