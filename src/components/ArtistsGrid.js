import { StyledGrid } from '@/styles'

const ArtistsGrid = ({artists}) => (
  <>
    {artists && artists.length ? (
      <StyledGrid type='artist'>
        {artists.map((artist, i) => (
          <li className='grid__item' key={i}>
            <a className='grid__item__inner' href={artist.uri}>
              {artist.images[0] && (
                <div className='grid__item__img'>
                  <img src={artist.images[0].url} alt={artist.name} />
                </div>
              )}
              <h3 className='grid__item__name overflow-ellipsis'>{artist.name}</h3>
              <p className='grid__item__label'>Artist</p>
            </a>
          </li>  
        ))}
      </StyledGrid>
    ): (
      <p className='empty-notice'>No artists available</p>
    )}
  </>
);

export default ArtistsGrid;