import { useResponsive } from "antd-style";
import { memo } from "react";
import { Flexbox } from "react-layout-kit";
import LangSwitch from "dumi/theme/slots/LangSwitch";
import Logo from "dumi/theme/slots/Logo";
import Navbar from "dumi/theme/slots/Navbar";
import SearchBar from "dumi/theme/slots/SearchBar";
import Burger from "dumi-theme-antd-style/dist/components/Burger";
import GithubButton from "dumi-theme-antd-style/dist/components/GithubButton";
import { useSiteStore } from "dumi-theme-antd-style/dist/store/useSiteStore";
import { useStyle } from "dumi-theme-antd-style/dist/slots/Header/style";
import ColorSwitch from "../ColorSwitch";

const Switcher = () => {
  const allowSwitchTheme = useSiteStore(
    (state) => state.siteData.themeConfig.prefersColor.switch,
  );

  return allowSwitchTheme ? <ColorSwitch /> : null;
};

const Header = () => {
  const hasHeader = useSiteStore((state) => !!state.routeMeta.frontmatter);
  const { mobile } = useResponsive();
  const { styles } = useStyle();

  if (!hasHeader) {
    return null;
  }

  return (
    <div className={styles.header}>
      <Flexbox
        horizontal
        distribution="space-between"
        align="center"
        width="auto"
        className={styles.content}
      >
        {mobile ? (
          <>
            <Flexbox>
              <Burger />
            </Flexbox>
            <Flexbox horizontal className={styles.left}>
              <Logo />
            </Flexbox>
            <Flexbox>
              <Switcher />
            </Flexbox>
          </>
        ) : (
          <>
            <Flexbox horizontal className={styles.left}>
              <Logo />
            </Flexbox>
            <Flexbox
              style={{
                marginLeft: 48,
                alignSelf: "end",
              }}
            >
              <Navbar />
            </Flexbox>
            <section className={styles.right}>
              <div />
              <Flexbox
                gap={16}
                horizontal
                align="center"
                className="dumi-default-header-right-aside"
              >
                <SearchBar />
                <LangSwitch />
                <GithubButton />
                <Switcher />
              </Flexbox>
            </section>
          </>
        )}
      </Flexbox>
    </div>
  );
};

export default memo(Header);
