const puppeteer = require('puppeteer');
const myInfo = require('../config/instagramInfo.json');

module.exports = {
    crawler: async(requestUrl)=>{
        try{
            const username = myInfo.username;
            const password = myInfo.password;
            const browser = await puppeteer.launch({headless: false});
            const page = await browser.newPage();
            await page.goto("https://www.instagram.com/");
            await page.waitForTimeout(2000);
            //로그인
            await page.type('input[name="username"]', username, {delay: 50});
            await page.type('input[name="password"]', password, {delay: 50});
            //let loginButton = await page.$x('//div[contains(text(), "Log In")]');
            let loginButton = await page.$x('//div[contains(text(), "로그인")]');
            await loginButton[0].click();
            //추가
            await page.setDefaultNavigationTimeout(0);
            await page.waitForTimeout(3000);
            await page.goto(requestUrl);
            // 크롤링
            await page.waitForSelector("article:first-of-type");
    
    
            const result = await page.evaluate(()=>{
                if(document.querySelector(".rkEop")!==null){
                    //비공개 계정
                    return "비공개 계정"
                }else{
                    //작성자
                    const writer = document.querySelector("a.sqdOP").textContent;
                    //const writer = document.querySelector("a.sqdOP")&&document.querySelector("a.sqdOP").textContent;
                    //사진, 동영상
                    var datas = [];
                    if(document.querySelector(".Ckrof")){
                        // 사진, 동영상이 여러장
                        const urls = document.querySelectorAll(".Ckrof");
                        urls.forEach((element)=>{
                            if(element.querySelector("._5wCQW")){
                                datas.push({
                                    category: "video",
                                    url: element.querySelector("._5wCQW video").src
                                });
                            }
                            if(element.querySelector(".KL4Bh")){
                                datas.push({
                                    category: "image",
                                    url: element.querySelector(".KL4Bh img").src
                                });
                            }
                        })
                    }else{
                        // 단일 사진 or 동영상
                        if(document.querySelector("._5wCQW")){
                            datas.push({
                                category: "video",
                                url: document.querySelector("._5wCQW video").src
                            });
                        }
                        else if(document.querySelector(".KL4Bh")){
                            datas.push({
                                category: "image",
                                url: document.querySelector(".KL4Bh img").src
                            });
                        }
                    }
    
                    //글 내용
                    if(document.querySelector("li.gElp9.rUo9f.PpGvg")){
                        // 글이 있다
                        var content = document.querySelector(".C4VMK").textContent;
                        if(content.includes(writer)){
                            content = content.replace(writer, "");
                        }
                    }else{
                        // 글이 없다.
                        var content = "";
                    }
                    return {
                        writer,
                        content,
                        datas
                    };
                }
            });
            //await page.close();
            //await browser.close();
            return result;
        }catch(err){
            console.log('insta crawl err : ', err);
            throw err;
            //return "인스타그램 크롤링 에러";
        }
    }
};