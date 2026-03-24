# CertChain API Test Suite
$base = "http://localhost:3000/api"
$addr = "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
$pass = 0
$fail = 0

function Call-API([string]$label, [string]$method, [string]$url, [string]$body, [int]$expectErr) {
    Write-Host ""
    Write-Host "--- $label ---" -ForegroundColor Cyan
    Write-Host "  $method $url" -ForegroundColor Gray

    try {
        $splat = @{ Uri = $url; Method = $method; ContentType = "application/json" }
        if ($body) { $splat.Body = $body }
        $r = Invoke-RestMethod @splat
        if ($expectErr -gt 0) {
            Write-Host "  FAIL: Expected error $expectErr but got success" -ForegroundColor Red
            $script:fail++
        } else {
            Write-Host "  PASS" -ForegroundColor Green
            $script:pass++
        }
        $r | ConvertTo-Json -Depth 5 -Compress | Write-Host -ForegroundColor DarkGray
        return $r
    } catch {
        $code = 0
        try { $code = [int]$_.Exception.Response.StatusCode } catch {}
        if ($expectErr -gt 0 -and $code -eq $expectErr) {
            Write-Host "  PASS (got expected $code)" -ForegroundColor Green
            $script:pass++
        } else {
            Write-Host "  FAIL: got $code - $($_.Exception.Message)" -ForegroundColor Red
            $script:fail++
        }
        return $null
    }
}

Write-Host "======================================" -ForegroundColor Magenta
Write-Host " CertChain API Tests" -ForegroundColor Magenta
Write-Host "======================================" -ForegroundColor Magenta

# 1 Health
Call-API "1. Health Check" GET "$base/health"

# 2 List courses
Call-API "2. List Courses" GET "$base/courses"

# 3 Get course 0
Call-API "3. Get Course 0" GET "$base/courses/0"

# 4 Course not found
Call-API "4. Course 999 (404)" GET "$base/courses/999" $null 404

# 5 Enroll
Call-API "5. Enroll" POST "$base/students/enroll" ('{"studentAddress":"'+$addr+'","courseId":0}')

# 6 Duplicate enroll
Call-API "6. Dup Enroll (409)" POST "$base/students/enroll" ('{"studentAddress":"'+$addr+'","courseId":0}') 409

# 7 Get enrollments
Call-API "7. Get Enrollments" GET "$base/students/enroll?studentAddress=$addr"

# 8-12 Complete modules 0-4
for ($i = 0; $i -le 4; $i++) {
    Call-API "8.$i Complete Module $i" POST "$base/students/complete-module" ('{"studentAddress":"'+$addr+'","courseId":0,"moduleId":'+$i+'}')
}

# 13 Dup module
Call-API "9. Dup Module (409)" POST "$base/students/complete-module" ('{"studentAddress":"'+$addr+'","courseId":0,"moduleId":0}') 409

# 14 Progress
Call-API "10. Module Progress" GET "$base/students/complete-module?studentAddress=$addr&courseId=0"

# 15 Quiz wrong
Call-API "11. Quiz Wrong" POST "$base/students/quiz" ('{"studentAddress":"'+$addr+'","courseId":0,"answers":{"0":0,"1":0,"2":0}}')

# 16 Quiz correct
Call-API "12. Quiz Correct" POST "$base/students/quiz" ('{"studentAddress":"'+$addr+'","courseId":0,"answers":{"0":1,"1":1,"2":1}}')

# 17 Mint
Call-API "13. Mint NFT" POST "$base/certificates/mint" ('{"studentAddress":"'+$addr+'","courseId":0,"studentName":"Chaitanya Dev"}')

# 18 Dup mint
Call-API "14. Dup Mint (409)" POST "$base/certificates/mint" ('{"studentAddress":"'+$addr+'","courseId":0,"studentName":"Chaitanya Dev"}') 409

# 19 Get certs
Call-API "15. All Certificates" GET "$base/certificates/mint"

# 20 Student certs
Call-API "16. Student Certs" GET "$base/certificates/mint?studentAddress=$addr"

# 21 Mint no enroll
Call-API "17. Mint No Enroll (403)" POST "$base/certificates/mint" '{"studentAddress":"0xDEAD000000000000000000000000000000000000","courseId":0,"studentName":"Nobody"}' 403

# 22 Create course
Call-API "18. Create Course" POST "$base/courses" '{"title":"Zero Knowledge Proofs","description":"ZK-SNARKs and ZK-STARKs","instructor":"Vitalik","category":"Crypto","difficulty":"Advanced","skills":["ZK-SNARKs"],"duration":"6h"}'

# 23 Verify list
Call-API "19. Verify List" GET "$base/courses"

Write-Host ""
Write-Host "======================================" -ForegroundColor Magenta
Write-Host " RESULTS: Passed=$pass Failed=$fail Total=$($pass+$fail)" -ForegroundColor $(if($fail-gt 0){"Yellow"}else{"Green"})
Write-Host "======================================" -ForegroundColor Magenta
if ($fail -eq 0) { Write-Host "ALL TESTS PASSED!" -ForegroundColor Green }
else { Write-Host "Some tests failed." -ForegroundColor Yellow }
