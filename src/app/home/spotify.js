import axios from "axios";
import { staticUserProfile, staticArtistsShortTerm, staticTracksShortTerm, 
  staticPlaylists, staticPlaylistsTracks, staticArtistsMediumTerm, staticArtistsLongTerm, 
  staticTracksMediumTerm, staticTracksLongTerm } from "@/static-profile"
import { BACKEND_URI } from "./utils";

// Boolean indicating rendering
const SSR = typeof window === 'undefined';

// Map of localStorage keys
const LOCALSTORAGE_KEYS = {
  accessToken: 'spotify_access_token',
  refreshToken: 'spotify_refresh_token',
  expireTime: 'spotify_token_expire_time',
  timestamp: 'spotify_token_timestamp',
  isStaticProfile: 'static_profile'
};

// Map of localStorage values
let LOCALSTORAGE_VALUES = {};
if (!SSR) {
  LOCALSTORAGE_VALUES = {
    accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
    refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
    expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
    timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
    isStaticProfile: window.localStorage.getItem(LOCALSTORAGE_KEYS.isStaticProfile)
  };
}

/**
 * If we are using access token, then we must set axios defaults for our requests.
 * Requires profileType.token to be populated with correct access token.
 * @returns {void}
 */
const setAxiosHeaders = (token) => {
  /**
   * Axios global request headers
   * https://github.com/axios/axios#global-axios-defaults
   */
  axios.defaults.baseURL = 'https://api.spotify.com/v1';
  axios.defaults.headers['Authorization'] = `Bearer ${token}`;
  axios.defaults.headers['Content-Type'] = 'application/json';
}

/**
 * If we are using a static profile, we must clear axios defaults so that if we make requests
 * they are not using an access token and will throw a bad request error
 * @returns {void}
 */
const clearAxiosHeaders = () => {
  axios.defaults.baseURL = '';
  axios.defaults.headers['Authorization'] = ``;
  axios.defaults.headers['Content-Type'] = '';
}

/**
 * Clears out localStorage and navigates to homepage
 * @returns {void}
 */
export const logout = () => { // Why export? Probably because we will be using this function outside of this page
  // WHY DON'T WE NEED TO USE SSR BOOLEAN HERE??? Because so far we are only calling it in a place where we already have that check.
  for (const property in LOCALSTORAGE_KEYS) {
    window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
  }
  //Navigate to homepage
  window.location = window.location.origin;
}

/**
 * Checks how much time has passed since the timestamp stored in localStorage
 * Is it greater than the expireTime?
 * @returns {boolean} If the access token in localStorage is expired
 */
const hasTokenExpired = () => {
  // If (Date.now() - timestamp) > expireTime then expired
  const {accessToken, timestamp, expireTime} = LOCALSTORAGE_VALUES;
  if (!accessToken || !timestamp) {
    return false;
  }
  const millisecondsElasped = Date.now() - Number(timestamp);
  return (millisecondsElasped/1000) > Number(expireTime);
}

/**
 * Use refresh token in localStorage to hit /refresh_token endpoint in our Node app
 * Then update values in localStorage with data from response
 * @returns {void}
 */
const refreshToken = async () => {
  try{
    if (SSR) { // Don't run on SSR
      return;
    }
    // Logout if no refresh token stored or managed to get into reload infinite loop
    if (!LOCALSTORAGE_VALUES.refreshToken || 
      LOCALSTORAGE_VALUES.refreshToken === 'undefined' ||
      (Date.now() - LOCALSTORAGE_VALUES.timestamp) < 1000) {
        console.error('No refresh token available');
        logout();
      }

    // Use refresh_token endpoint in our Node app
    const { data } = await axios.get(`${BACKEND_URI()}/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`);

    //Update values in localStorage
    window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.access_token);
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
    window.localStorage.setItem(LOCALSTORAGE_KEYS.expireTime, data.expires_in);
    setAxiosHeaders(data.access_token);

    // Reload app for changes to take effect
    window.location.reload();
  } catch (e) {
    console.error(e);
  }
};

/**
 * Handles logic for retrieving the spotify access token from localStorage
 * or URL query params if logging in for the first time
 * @returns {string} A Spotify access token
 */
const getProfileType = () =>{
  if (SSR) {
    //We want to skip this method on SSR
    return null;
  }
  
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get('access_token'),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get('expires_in'),
    [LOCALSTORAGE_KEYS.isStaticProfile]: urlParams.get('static_profile')
  }

  console.log(queryParams);

  // Prioritize login in this order: URL params, static page, access token

  // If there is static profile in URL params, user has gone into static profile for the first time
  if (queryParams[LOCALSTORAGE_KEYS.isStaticProfile]) {
    clearAxiosHeaders();
    // Store static profile boolean in local storage
    window.localStorage.setItem(LOCALSTORAGE_KEYS.isStaticProfile, queryParams[LOCALSTORAGE_KEYS.isStaticProfile]);

    return {
      token: false,
      staticProfile: queryParams[LOCALSTORAGE_KEYS.isStaticProfile]
    };
  }

  // If there is a token in the URL params, user is logging in for the first time
  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    setAxiosHeaders(queryParams[LOCALSTORAGE_KEYS.accessToken]);
    // Store all params in localStorage
    for (const property in queryParams) {
      window.localStorage.setItem(property, queryParams[property]);
    }
    // Set timestamp
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
    // Return access token from query params
    return {
      token: queryParams[LOCALSTORAGE_KEYS.accessToken],
      staticProfile: false
    };
  }

  // If valid static profile boolean in local storage
  if (LOCALSTORAGE_VALUES.isStaticProfile && LOCALSTORAGE_VALUES.isStaticProfile !== 'null') {
    console.log("SETTING STATIC")
    clearAxiosHeaders();
    return {
      token: false,
      staticProfile: LOCALSTORAGE_VALUES.isStaticProfile
    };
  }
  
  //Handle access token case
  const hasError = urlParams.get('error');

  // If error or access token has expired or access token in local storage not defined
  if (hasError || hasTokenExpired() || LOCALSTORAGE_VALUES.accessToken === 'undefined') {
    refreshToken();
  }
  
  // If valid access token in local storage
  if (LOCALSTORAGE_VALUES.accessToken && LOCALSTORAGE_VALUES.accessToken !== 'undefined') {
    setAxiosHeaders(LOCALSTORAGE_VALUES.accessToken);
    return {
      token: LOCALSTORAGE_VALUES.accessToken,
      staticProfile: false
    };
  }

  // Get here if not logged in, in any way
  return {
    token: false,
    staticProfile: false
  };
};

export const profileType = getProfileType();

/**
 * Get Current User's Profile - store Spotify User ID in localStorage
 * https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
 * @returns {Promise}
 */
export const getCurrentUserProfile = async () => {
  if (profileType.staticProfile) {
    return staticUserProfile;
  }
  const response = await axios.get('/me');
  window.localStorage.setItem('user_id', response.data.id);
  return response;
}

/**
 * Get Current User's ID - uses either localStorage or CurrentUserProfile endpoint
 * @returns {Promise}
 */
export const getCurrentUserID = async () => {
  if (!window.localStorage.getItem('user_id') && window.localStorage.getItem('user_id') !== 'undefined'){
    const response = await getCurrentUserProfile();
    return response.data.id;
  }else{
    return window.localStorage.getItem('user_id');
  }
}

/**
 * Get a List of Current User's Playlists
 * https://developer.spotify.com/documentation/web-api/reference/get-a-list-of-current-users-playlists
 * @returns {Promise}
 */
export const getCurrentUserPlaylists = (limit = 20) => {
  if (profileType.staticProfile) {
    return staticPlaylists;
  }
  return axios.get(`/me/playlists?limit=${limit}`);
};

/**
 * Get a User's Top Artists
 * https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
 * @param {string} time_range - 'short_term' (approx. last 4 weeks), 'medium_term' (approx. last 6 months) or 'long_term' (calculated from several years of data and including all new data as it becomes available). Default is medium_term
 * @returns {Promise}
 */
export const getTopArtists = (time_range = 'short_term') => {
  if (profileType.staticProfile) {
    if (time_range == 'short_term') {
      return staticArtistsShortTerm;
    } else if (time_range == 'medium_term') {
      return staticArtistsMediumTerm;
    } else {
      return staticArtistsLongTerm;
    }
  }
  return axios.get(`/me/top/artists?time_range=${time_range}`);
};

/**
 * Get a User's Top Tracks
 * https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
 * @param {string} time_range - 'short_term' (approx. last 4 weeks), 'medium_term' (approx. last 6 months) or 'long_term' (calculated from several years of data and including all new data as it becomes available). Default is medium_term
 * @returns {Promise}
 */
export const getTopTracks = (time_range = 'short_term', limit = 20) => {
  if (profileType.staticProfile) {
    if (time_range == 'short_term') {
      return staticTracksShortTerm;
    } else if (time_range == 'medium_term') {
      return staticTracksMediumTerm;
    } else {
      return staticTracksLongTerm;
    }
  }
  return axios.get(`/me/top/tracks?time_range=${time_range}&limit=${limit}`);
};

/**
 * Get a playlist owned by a spotify user
 * https://developer.spotify.com/documentation/web-api/reference/get-playlist
 * @param {string} playlist_id - The Spotify ID of the playlist
 * @returns {Promise}
 */
export const getPlaylistById = (playlist_id) => {
  if (profileType.staticProfile) {
    const numPlaylists = staticPlaylistsTracks.playlists.length;

    for (let i = 0; i < numPlaylists; i++) {
      const playlist = staticPlaylistsTracks.playlists[i];
      if (playlist.data.id == playlist_id) {
        return playlist;
      }
    }
  }
  return axios.get(`/playlists/${playlist_id}`);
}

/**
 * Get audio features for multiple tracks based on their Spotify IDs
 * https://developer.spotify.com/documentation/web-api/reference/get-several-audio-features
 * @param {string} ids - A comma-separated list of the Spotify IDs for the tracks. Maximum: 100 IDs
 * @returns {Promise}
 */
export const getAudioFeaturesForTracks = (ids) => {
  return axios.get(`/audio-features?ids=${ids}`);
}

const shortMonthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 
  'May', 'Jun', 'Jul', 'Aug', 
  'Sep', 'Oct', 'Nov', 'Dec'
];

const formattedDate = () => {
  const today = new Date();
  
  const year = today.getFullYear().toString();
  const monthIndex = today.getMonth();
  const day = today.getDate().toString();

  const shortMonth = shortMonthNames[monthIndex];
  const formattedDate = (day < 10 ? '0' + day : day) + ' ' + shortMonth + ' ' + year;
  return formattedDate;
}

/**
 * Create a playlist for a Spotify user - the playlist will be empty until tracks are added
 * https://developer.spotify.com/documentation/web-api/reference/create-playlist
 * @param {string} user_id - Spotify user's ID
 * @returns {Promise}
 */
export const createPlaylist = async (user_id, trackUris, timeRange) => {
  const timeMapping = {
    'short': "last 4 weeks",
    'medium': "last 6 months",
    'long': "of all time"
  }
  
  try{ 
    const playlist = await axios.post(`${BACKEND_URI()}/create_playlist?user_id=${user_id}`, {
        name: `Top Tracks ${timeMapping[timeRange]}`,
        description: `As of ${formattedDate()}. Made with <3 by ABDI`
    });
    
    if (playlist.data.status){
      console.log(playlist);
      console.error("Error creating playlist! Check logs.");
    }

    const snapshotID = await axios.post(`${BACKEND_URI()}/add_tracks_playlist?playlist_id=${playlist.data.id}`, {
      uris: trackUris,
      position: 0
    });

    if (snapshotID.data.status){
      console.log(snapshotID);
      console.error("Error adding tracks to new playlist! Check logs.");
    }

    return playlist;
  } catch (error) {
    console.log(error);
  }
}

