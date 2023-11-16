"use client";

import { useState, useEffect } from "react";
import { getTopArtists } from "@/app/home/spotify";
import { catchErrors } from "@/app/home/utils";
import { SectionWrapper, ArtistsGrid, TimeRangeButtons, Loader } from "@/components";

const TopArtists = () => {
  const [topArtists, setTopArtists] = useState(null);
  const [timeRange, setTimeRange] = useState('short');

  useEffect(() => {
    const fetchData = async () => {
      const userTopArtists = await getTopArtists(`${timeRange}_term`);
      setTopArtists(userTopArtists.data);
    }
  
    catchErrors(fetchData());
  }, [timeRange]);
  
  return (
    <main>
      <SectionWrapper title="Top Artists" breadcrumb="true">
        <TimeRangeButtons timeRange={timeRange} setTimeRange={setTimeRange} />
        {topArtists ? (
          <ArtistsGrid artists={topArtists.items} />
        ) : (
          <Loader />
        )}
      </SectionWrapper>
    </main>
  )
};

export default TopArtists;
