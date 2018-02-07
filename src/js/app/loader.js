import banner_1 from '../../img/banner_1.jpg';
import banner_2 from '../../img/banner_2.jpg';
import banner_3 from '../../img/banner_3.jpg';
import banner_bg_image_1 from '../../img/cloth_bg_1.jpg';
import banner_bg_image_2 from '../../img/cloth_bg_3.jpg';
import gallery_item_1 from '../../img/female.jpg';
import gallery_item_2 from '../../img/male.jpg';
import gallery_item_3 from '../../img/sport.jpg';
import gallery_item_4 from '../../img/casual.jpg';
import news_item_1 from '../../img/news_1.jpg';
import news_item_2 from '../../img/news_2.jpg';
import news_item_3 from '../../img/news_3.jpg';
import news_item_4 from '../../img/news_4.jpg';

const loaderCreate = (query, log, events) => {
  const images = [
    banner_1,
    banner_2,
    banner_3,
    banner_bg_image_1,
    banner_bg_image_2,
    gallery_item_1,
    gallery_item_2,
    gallery_item_3,
    news_item_1,
    news_item_2,
    news_item_3,
    news_item_4 ].map((image) => {
    let img = new Image();
    img.src = image;
    return new Promise((resolve,reject)=>{
      img.onload = () => {
        query(img).remove();
        img = null;
        resolve(true);
      };
      img.onerror = (e) => {
        log(e);
        img = null;
        reject(false);
      };
    });
  });
  const handleInOut = (e) => {
    e.loader.velocity('stop');
    e.loader.velocity('fadeOut',{duration: 1000, complete: () => {
      e.app.velocity('stop');
      e.app.velocity('fadeIn',{duration: 1000, complete: () => {
        e = {};
        events.emit('ACL',{ load:'map' });
      }});
    }});
  }
  events.on('DCL',handleInOut);

  return images;
}
export default loaderCreate;
