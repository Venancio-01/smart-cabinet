import useTime from './useTime'

export default function useInit() {
  const { startGenerateCurrentTime } = useTime()

  useEffect(() => {
    startGenerateCurrentTime()
  }, [])
}
