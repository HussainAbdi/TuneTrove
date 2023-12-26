"use client";

import { PlaylistsGrid, SectionWrapper, Loader } from '@/components'
import { catchErrors } from '../utils';
import { getCurrentUserPlaylists, profileType } from '../spotify';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Playlists() {
  const [playlistsData, setPlaylistsData] = useState(null);
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userPlaylists = await getCurrentUserPlaylists();
      setPlaylistsData(userPlaylists.data);
    }
  
    catchErrors(fetchData());
  }, []);

  useEffect(() => {
    if (!playlistsData){
      return;
    }

    const fetchMoreData = async () => {
      if (playlistsData.next && profileType.token){
        const { data } = await axios.get(playlistsData.next);
        setPlaylistsData(data);
      }
    }

    setPlaylists(playlists => ([
      ...playlists ? playlists : [],
      ...playlistsData.items
    ]));

    catchErrors(fetchMoreData());
  }, [playlistsData]);

  return (
    <main>
      <SectionWrapper title="Public Playlists" breadcrumb="true">
        {playlists ? (
          <PlaylistsGrid playlists={playlists} />
        ) : (
          <Loader />
        )}
      </SectionWrapper>
    </main>
  )
}
