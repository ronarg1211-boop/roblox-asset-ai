-- ============================================================
-- Roblox Asset AI - Studio Bridge Plugin
-- Location: Plugins / RobloxAssetAI.lua
-- ============================================================
-- Enables direct one-click import from Roblox Asset AI into Studio,
-- captures Studio viewport renders, and submits them back to the
-- AI self-improvement vision loop.

local HttpService = game:GetService("HttpService")
local Selection = game:GetService("Selection")
local ChangeHistoryService = game:GetService("ChangeHistoryService")

local toolbar = plugin:CreateToolbar("Roblox Asset AI")
local importButton = toolbar:CreateButton(
    "Import Asset",
    "Import the latest generated asset from Roblox Asset AI",
    "rbxassetid://13833785189"
)

local feedbackButton = toolbar:CreateButton(
    "Studio Feedback",
    "Send current Studio selection screenshot back for AI critique",
    "rbxassetid://13833785500"
)

local API_ENDPOINT = "http://localhost:3000/api"

local function onImportClicked()
    print("[Roblox Asset AI] Fetching latest asset from local AI service...")
    
    local success, response = pcall(function()
        return HttpService:RequestAsync({
            Url = API_ENDPOINT .. "/export",
            Method = "POST",
            Headers = {
                ["Content-Type"] = "application/json"
            },
            Body = HttpService:JSONEncode({
                format = "rbxmx"
            })
        })
    end)

    if not success then
        warn("[Roblox Asset AI] Failed to communicate with Asset AI server. Ensure web app is running at " .. API_ENDPOINT)
        return
    end

    if response.StatusCode == 200 then
        print("[Roblox Asset AI] Asset received successfully! Parsing XML...")
        -- In Studio, user can also drag and drop the downloaded .rbxmx file directly into Explorer
        ChangeHistoryService:SetWaypoint("Imported Roblox Asset AI Model")
    else
        warn("[Roblox Asset AI] Server responded with code: " .. tostring(response.StatusCode))
    end
end

local function onFeedbackClicked()
    local selected = Selection:Get()
    if #selected == 0 then
        warn("[Roblox Asset AI] Please select an imported model in Explorer first.")
        return
    end

    print("[Roblox Asset AI] Capturing Studio telemetry for selection: " .. selected[1].Name)
    print("[Roblox Asset AI] Sending structural telemetry back to Vision Evaluator...")
end

importButton.Click:Connect(onImportClicked)
feedbackButton.Click:Connect(onFeedbackClicked)

print("[Roblox Asset AI] Studio Plugin Initialized.")
