import { Tabs, Tab, Typography, Box, Button } from '@mui/material'
import PasswordAuth from './PasswordAuth';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Props {
  onClose: () => void
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function LoginPanel({ onClose }: Props) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleClose = () => {
    onClose()
  }

  return (
    <div className='w-[400px] h-[300px] bg-white flex flex-col'>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} variant="fullWidth" onChange={handleChange} aria-label="basic tabs example">
          <Tab label="密码认证" />
          <Tab label="指纹认证" />
          <Tab label="卡片认证" />
        </Tabs>
      </Box>
      <div className='px-6 py-4  flex-1'>
        {
          value === 0 && <PasswordAuth />
        }
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
      </div>

      <div className='px-6 pb-2'>
        <Button variant="outlined" fullWidth onClick={handleClose}>关闭</Button>
      </div>
    </div>
  )
}
