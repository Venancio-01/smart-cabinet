

export default function () {
  const loadImage = () => {
    const imgs = ['public/images/gif_finger.gif']

    imgs.forEach(item => {
      const img = new Image()
      img.src = item
      img.onload = () => {
        console.log(item, 'item loaded')
      }
    })
  }

  return {
    loadImage
  }
}
