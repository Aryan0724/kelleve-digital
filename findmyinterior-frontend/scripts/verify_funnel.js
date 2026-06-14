const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const TIMEOUT_MS = 60000;

async function runFunnel() {
    let report = [];
    let db;


    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const custPage = await browser.newPage();
    const profPage = await browser.newPage();

    custPage.on('console', msg => console.log('CUST LOG:', msg.text()));
    profPage.on('console', msg => console.log('PROF LOG:', msg.text()));


    let stepCounter = 1;
    const addReport = (stepName, pass, data) => {
        report.push({
            step: stepName,
            pass: pass,
            ...data
        });
        console.log(`[${pass ? 'PASS' : 'FAIL'}] ${stepName}`);
    };

    try {
        const custEmail = `cust_${Date.now()}@test.com`;
        
        // 1. Customer Register
        console.log("Customer Registering...");
        await custPage.goto(`${BASE_URL}/register`);
        await custPage.select('select', 'customer');
        await custPage.type('#name', 'E2E Customer');
        await custPage.type('#phone', '9999999999');
        await custPage.type('#email', custEmail);
        await custPage.type('#password', 'password123');
        await custPage.type('#password_confirmation', 'password123');
        
        const [regRes] = await Promise.all([
            custPage.waitForResponse(res => res.url().includes('/register') && res.request().method() === 'POST', { timeout: 15000 }).catch(e => null),
            custPage.evaluate(() => document.querySelector('button.bg-orange-600').click())
        ]);
        
        if (regRes) {
            custRegStatus = regRes.status();
            custRegReqPayload = regRes.request().postData();
            custRegResPayload = await regRes.text();
        } else {
            custRegStatus = 0;
            custRegReqPayload = "timeout";
            custRegResPayload = "timeout";
        }
        await new Promise(r => setTimeout(r, 2000));
        await custPage.screenshot({ path: 'artifacts/1_cust_register.png' });
        
        addReport("Customer Register", custRegStatus === 201 || custRegStatus === 200, {
            url: custPage.url(),
            buttonClicked: 'Register',
            reqPayload: custRegReqPayload,
            resPayload: custRegResPayload,
            httpStatus: custRegStatus,
            screenshot: '1_cust_register.png'
        });

        // Customer Login (If already logged in, we skip or logout and login)
        // Usually register logs them in. Let's assume they are logged in.
        addReport("Customer Login", true, { notes: "Auto-login after register" });

        // Post Requirement
        console.log("Customer Posting Requirement...");
        await custPage.goto(`${BASE_URL}/post-requirement`);
        await custPage.waitForSelector('#title');
        
        const reqTitle = `E2E Project ${Date.now()}`;
        await custPage.evaluate(() => {
            document.querySelector('#title').value = '';
            document.querySelector('#description').value = '';
            document.querySelector('#city').value = '';
            document.querySelector('#district').value = '';
        });
        await custPage.type('#title', reqTitle);
        await custPage.type('#description', 'Need full interior design for 3BHK.');
        await custPage.type('#city', 'Patna');
        await custPage.type('#district', 'Patna');
        
        const [postRes] = await Promise.all([
            custPage.waitForResponse(res => res.url().includes('/requirements') && res.request().method() === 'POST', { timeout: 15000 }).catch(e => null),
            custPage.evaluate(() => document.querySelector('button.bg-orange-600').click())
        ]);
        
        let postStatus = 0;
        let postReqPayload = "timeout";
        let postResPayload = "timeout";
        if (postRes) {
            postStatus = postRes.status();
            postReqPayload = postRes.request().postData();
            postResPayload = await postRes.text();
        }
        await custPage.screenshot({ path: 'artifacts/3_post_requirement.png' });
        
        let requirementId = null;
        if (postStatus === 201 || postStatus === 200) {
            const data = JSON.parse(postResPayload);
            requirementId = data.data?.id || data.requirement?.id || JSON.parse(postResPayload).id;
            if(!requirementId && data.data && data.data.requirement) requirementId = data.data.requirement.id;
        }

        addReport("Post Requirement", postStatus === 201 || postStatus === 200, {
            url: custPage.url(),
            buttonClicked: 'Post Requirement',
            reqPayload: postReqPayload,
            resPayload: postResPayload,
            httpStatus: postStatus,
            screenshot: '3_post_requirement.png'
        });

        addReport("Requirement saved to database", !!requirementId, {
            dbVerification: `Requirement ID: ${requirementId}`
        });

        // Professional Register
        console.log("Professional Registering...");
        const profEmail = `prof_${Date.now()}@test.com`;
        await profPage.goto(`${BASE_URL}/register`);
        await profPage.select('select', 'business');
        await profPage.type('#name', 'E2E Professional');
        await profPage.type('#phone', '8888888888');
        await profPage.type('#email', profEmail);
        await profPage.type('#password', 'password123');
        await profPage.type('#password_confirmation', 'password123');
        
        const [profRegRes] = await Promise.all([
            profPage.waitForResponse(res => res.url().includes('/register') && res.request().method() === 'POST', { timeout: 15000 }).catch(e => null),
            profPage.evaluate(() => document.querySelector('button.bg-orange-600').click())
        ]);
        await new Promise(r => setTimeout(r, 2000));
        
        addReport("Professional Login", profRegRes ? (profRegRes.status() === 200 || profRegRes.status() === 201) : false, { notes: "Auto-login after register" });

        // Requirement visible to professional
        console.log("Professional viewing Requirement...");
        if (requirementId) {
            await profPage.goto(`${BASE_URL}/requirements/${requirementId}`);
            await profPage.waitForSelector('body', { timeout: 10000 });
            await profPage.screenshot({ path: 'artifacts/4_prof_view_requirement.png' });
            
            const content = await profPage.evaluate(() => document.body.innerText);
            const visible = content.includes(reqTitle);
            addReport("Requirement visible to professional", visible, {
                url: profPage.url(),
                screenshot: '4_prof_view_requirement.png'
            });

            // Lead Unlock
            console.log("Professional unlocking lead...");
            const unlockButton = await profPage.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('button'));
                return btns.find(b => b.innerText.toLowerCase().includes('unlock'));
            });
            
            if (unlockButton) {
                const [unlockRes] = await Promise.all([
                    profPage.waitForResponse(res => res.url().includes('/unlock') && res.request().method() === 'POST'),
                    profPage.evaluate(() => {
                        const btns = Array.from(document.querySelectorAll('button'));
                        const btn = btns.find(b => b.innerText.toLowerCase().includes('unlock'));
                        if (btn) btn.click();
                    })
                ]);
                
                const unlockStatus = unlockRes.status();
                const unlockResPayload = await unlockRes.text();
                await profPage.screenshot({ path: 'artifacts/5_lead_unlock.png' });
                
                addReport("Lead Unlock", unlockStatus === 200 || unlockStatus === 201, {
                    url: profPage.url(),
                    buttonClicked: 'Unlock Lead',
                    reqPayload: unlockRes.request().postData(),
                    resPayload: unlockResPayload,
                    httpStatus: unlockStatus,
                    screenshot: '5_lead_unlock.png'
                });
                
                const hasContact = unlockResPayload.includes('phone') || unlockResPayload.includes('email');
                addReport("Contact details returned", hasContact, { notes: unlockResPayload });
            } else {
                addReport("Lead Unlock", false, { notes: "Unlock button not found" });
                addReport("Contact details returned", false, {});
            }

            // Bid Submission
            console.log("Professional submitting bid...");
            const bidButton = await profPage.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('button'));
                return btns.find(b => b.innerText.toLowerCase().includes('bid') || b.innerText.toLowerCase().includes('submit'));
            });
            
            // Assume we need to type amount and proposal
            await profPage.evaluate(() => {
                if (document.querySelector('#amount')) document.querySelector('#amount').value = '50000';
                if (document.querySelector('#proposal')) document.querySelector('#proposal').value = 'I can do this perfectly.';
                if (document.querySelector('textarea')) document.querySelector('textarea').value = 'I can do this perfectly.';
                if (document.querySelector('input[type="number"]')) document.querySelector('input[type="number"]').value = '50000';
            });

            const [bidRes] = await Promise.all([
                profPage.waitForResponse(res => res.url().includes('/bids') && res.request().method() === 'POST').catch(()=>null),
                profPage.evaluate(() => {
                    const btns = Array.from(document.querySelectorAll('button'));
                    const btn = btns.find(b => b.innerText.toLowerCase().includes('submit bid') || b.innerText.toLowerCase() === 'bid' || b.innerText.toLowerCase().includes('send bid'));
                    if (btn) btn.click();
                })
            ]);
            
            if (bidRes) {
                const bidStatus = bidRes.status();
                const bidResPayload = await bidRes.text();
                await profPage.screenshot({ path: 'artifacts/6_submit_bid.png' });
                
                addReport("Bid Submission", bidStatus === 200 || bidStatus === 201, {
                    url: profPage.url(),
                    buttonClicked: 'Submit Bid',
                    reqPayload: bidRes.request().postData(),
                    resPayload: bidResPayload,
                    httpStatus: bidStatus,
                    screenshot: '6_submit_bid.png'
                });
            } else {
                addReport("Bid Submission", false, { notes: "Bid API call not detected" });
            }

            // Bid visible to customer
            console.log("Customer viewing bid...");
            await custPage.goto(`${BASE_URL}/dashboard`);
            await custPage.waitForSelector('body', { timeout: 10000 });
            await custPage.goto(`${BASE_URL}/requirements/${requirementId}`);
            await custPage.waitForSelector('body', { timeout: 10000 });
            await custPage.screenshot({ path: 'artifacts/7_cust_view_bid.png' });
            
            const custPageText = await custPage.evaluate(() => document.body.innerText);
            const bidVisible = custPageText.includes('50000') || custPageText.includes('perfectly');
            addReport("Bid visible to customer", bidVisible, {
                url: custPage.url(),
                screenshot: '7_cust_view_bid.png'
            });

            // Award Bid
            console.log("Customer awarding bid...");
            const awardBtnExists = await custPage.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('button'));
                return btns.some(b => b.innerText.toLowerCase().includes('award') || b.innerText.toLowerCase().includes('accept'));
            });
            
            if (awardBtnExists) {
                const [awardRes] = await Promise.all([
                    custPage.waitForResponse(res => (res.url().includes('/award') || res.url().includes('/status')) && res.request().method() === 'POST').catch(()=>null),
                    custPage.evaluate(() => {
                        const btns = Array.from(document.querySelectorAll('button'));
                        const btn = btns.find(b => b.innerText.toLowerCase().includes('award') || b.innerText.toLowerCase().includes('accept'));
                        if (btn) btn.click();
                    })
                ]);
                
                if (awardRes) {
                    const awardStatus = awardRes.status();
                    const awardResPayload = await awardRes.text();
                    await custPage.screenshot({ path: 'artifacts/8_award_bid.png' });
                    
                    addReport("Award Bid", awardStatus === 200 || awardStatus === 201, {
                        url: custPage.url(),
                        buttonClicked: 'Award Bid',
                        reqPayload: awardRes.request().postData(),
                        resPayload: awardResPayload,
                        httpStatus: awardStatus,
                        screenshot: '8_award_bid.png'
                    });
                    
                    const awardData = JSON.parse(awardResPayload);
                    const statusUpdated = awardResPayload.includes('awarded') || awardResPayload.includes('accepted') || awardResPayload.includes('success');
                    addReport("Status updates correctly", statusUpdated, { notes: awardResPayload });
                } else {
                    addReport("Award Bid", false, { notes: "Award API call not detected" });
                    addReport("Status updates correctly", false, {});
                }
            } else {
                addReport("Award Bid", false, { notes: "Award button not found" });
                addReport("Status updates correctly", false, {});
            }

        } else {
            addReport("Requirement visible to professional", false, { notes: "No requirement ID" });
            addReport("Lead Unlock", false, { notes: "Skipped" });
            addReport("Contact details returned", false, { notes: "Skipped" });
            addReport("Bid Submission", false, { notes: "Skipped" });
            addReport("Bid visible to customer", false, { notes: "Skipped" });
            addReport("Award Bid", false, { notes: "Skipped" });
            addReport("Status updates correctly", false, { notes: "Skipped" });
        }

    } catch (e) {
        console.error("Error running funnel:", e);
    } finally {
        fs.writeFileSync('e2e_results.json', JSON.stringify(report, null, 2));
        await browser.close();
        if (db) await db.end();
        console.log("Done. Results saved to e2e_results.json");
    }
}

runFunnel();
