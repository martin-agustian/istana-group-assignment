type Props = {
  description?: string;
  children: React.ReactNode;
  title?: string;
};

const PageContainer = ({ title, description, children }: Props) => (
  <>
    <title>{title}</title>
    <meta name="description" content={description} />
    {children}
  </>
);

export default PageContainer;
