import previous from './content-week-20261022-travel.mjs';
import later from './content-week-20261029-travel.mjs';
export default [
 {...previous[2],price:'34,900원~ (검색 시작가)',imageSource:'https://dry7pvlp22cox.cloudfront.net/mrt-images-prod/2024/11/25/46jK/y607Wp7zmw.jpg'},
 {...later[2],price:'8,000원~ (검색 시작가)',imageSource:'https://dry7pvlp22cox.cloudfront.net/mrt-images-prod/2026/10/26/7kF2/7WnD71c7I8.jpg'},
 {...later[3],price:'30,000원~ (검색 시작가)',imageSource:'https://dry7pvlp22cox.cloudfront.net/mrt-images-prod/2024/11/04/P2fr/STtwh4vfps.jpg'},
 {...later[4],price:'50,000원~ (검색 시작가)',imageSource:'https://dry7pvlp22cox.cloudfront.net/mrt-images-prod/2024/11/25/Ay8g/1ZQsnEjw3w.jpg'},
 {...later[5],reviews:52,price:'18,000원~ (검색 시작가)',imageSource:'https://dry7pvlp22cox.cloudfront.net/mrt-images-prod/2024/11/27/HSuQ/ryAQXXrbbs.jpg'},
 {...later[6],price:'26,900원~ (검색 시작가)',imageSource:'https://dry7pvlp22cox.cloudfront.net/mrt-images-prod/2026/11/05/gTJt/ErFBpohMDm.jpg'},
 {...later[1],price:'선택 날짜·인원별 현재 가격 확인'},
].map((r,index)=>({gid:r.gid,product:r.product,href:r.href,rating:r.rating,reviews:r.reviews,price:r.price,photos:r.photos,cardImage:r.imageSource?'week-20261112-'+r.gid+'.jpg':r.cardImage,imageSource:r.imageSource,checkedAt:'2026-11-09',index}));
