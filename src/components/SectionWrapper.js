import Link from "next/link";
import { StyledSection } from '@/styles'

const SectionWrapper = ({ children, title, seeAllLink, breadcrumb }) => (
  <StyledSection>
    <div className="section__inner">
      <div className="section__top">
        <h2 className="section__heading">
          {breadcrumb && (
            <span className="section__breadcrumb">
              <Link href="/home">Profile</Link>
            </span>
          )}
          {title && (
            <>
              {seeAllLink ? (
                <Link href={seeAllLink}>{title}</Link>
              ) : (
                <span>{title}</span>
              )}
            </>
          )}
        </h2>
        {seeAllLink && (
          <Link href={seeAllLink} className="section__see-all">See All</Link>
        )}
      </div>

      {children}
    </div>
  </StyledSection>
);

export default SectionWrapper;