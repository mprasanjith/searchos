import { createStyles } from "@mantine/core";

type FooterProps = {
  className?: string;
};
const useStyles = createStyles(() => ({
  copyRightText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
}));

export const Footer = ({ className }: FooterProps) => {
  const { classes, cx } = useStyles();
  return (
    <footer className={cx(classes.copyRightText, className)}>
      <p>Copyright © 2023 SearchOS. All rights reserved.</p>
    </footer>
  );
};
