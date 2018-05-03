import banner1 from '../../img/banner_1.jpg'
import banner2 from '../../img/banner_2.jpg'
import banner3 from '../../img/banner_3.jpg'
import bannerBgImage1 from '../../img/cloth_bg_1.jpg'
import bannerBgImage2 from '../../img/cloth_bg_3.jpg'
import galleryItem1 from '../../img/female.jpg'
import galleryItem2 from '../../img/male.jpg'
import galleryItem3 from '../../img/sport.jpg'
import galleryItem4 from '../../img/casual.jpg'
import newsItem1 from '../../img/news_1.jpg'
import newsItem2 from '../../img/news_2.jpg'
import newsItem3 from '../../img/news_3.jpg'
import newsItem4 from '../../img/news_4.jpg'
import $ from 'jquery'

const loader = () => {
  const images = [
    banner1,
    banner2,
    banner3,
    bannerBgImage1,
    bannerBgImage2,
    galleryItem1,
    galleryItem2,
    galleryItem3,
    galleryItem4,
    newsItem1,
    newsItem2,
    newsItem3,
    newsItem4 ].map((image) => {
    let img = new Image()
    img.src = 'dist/' + image
    return new Promise((resolve, reject) => {
      img.onload = () => {
        $(img).remove()
        img = null
        resolve(true)
      }
      img.onerror = (e) => {
        img = null
        reject(new Error('Image load error!'))
      }
    })
  })
  return images
}
export default loader
