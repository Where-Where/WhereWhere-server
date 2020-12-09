const puppeteer = require('puppeteer');

module.exports = {
    crawl: async(requestUrl)=>{
        try{
            const browser = await puppeteer.launch({headless: false});
            const page = await browser.newPage();
            /*
            // 로그인 할 필요가 없다.. 왜나면 안되기 때문이지
            await page.goto("https://www.facebook.com/");
            await page.waitForTimeout(2000);
    
            //로그인
            await page.type('input[name="email"]', username, {delay: 50});
            await page.type('input[name="pass"]', password, {delay: 50});
            await page.click("div._6ltg > button ");
            await page.waitForTimeout(3000);
            */
            
            await page.goto(requestUrl);
            await page.waitForTimeout(4000);
            await page.click("div._62up > a");
            //await page.waitForSelector("article:first-of-type");
            const result = await page.evaluate(()=>{
                const writer = document.querySelector(".fwb.fcg").textContent;
                const content = document.querySelector("._5pbx.userContent._3576").textContent;
                // 사진만 여러장
                var datas = [];
                const images = document.querySelectorAll("._2a2q._65sr a");
                images.forEach((element)=>{
                    if(element.getAttribute("data-ploi")){
                        datas.push({
                            image: element.getAttribute("data-ploi")
                        });    
                    }
                });
                return {
                    writer,
                    content,
                    datas
                };
            });
            await page.close();
            await browser.close();
            console.log("크롤링 중 입니다.");
            return result;
            
        }catch(err){
            console.log("비공개 게시글 혹은 크롤링 중 문제 발생");
            await page.close();
            await browser.close();
            //return "비공개 게시글";
            throw err;
        }
    }
};