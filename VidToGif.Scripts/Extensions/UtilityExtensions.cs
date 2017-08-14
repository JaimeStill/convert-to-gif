using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Management.Automation;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace VidToGif.Scripts.Extensions
{
    public static class UtilityExtensions
    {
        public static string GetExceptionMessageChain(this Exception ex)
        {
            var message = new StringBuilder(ex.Message);

            if (ex.InnerException != null)
            {
                message.AppendLine(GetExceptionMessageChain(ex.InnerException));
            }

            return message.ToString();
        }

        public static async Task<string> GetTextFromEmbeddedResource(this string resourceName)
        {
            string text = string.Empty;
            var assembly = Assembly.GetExecutingAssembly();

            using (var stream = assembly.GetManifestResourceStream($"{assembly.GetName().Name}{resourceName}"))
            {
                using (StreamReader reader = new StreamReader(stream))
                {
                    text = await reader.ReadToEndAsync();
                }
            }

            return text;
        }

        public static Task<ConsoleOutput> GetPowershellOutput(this PowerShell ps)
        {
            return Task.Run(() =>
            {
                var result = new StringBuilder();
                var error = new StringBuilder();
                var output = new ConsoleOutput();

                output.hasError = ps.HadErrors;

                if (ps.Streams.Error.Count > 0)
                {
                    foreach (var err in ps.Streams.Error)
                    {
                        error.AppendLine(err.GetCategoryInfo());
                        error.AppendLine(err.Exception.GetExceptionMessageChain());
                    }
                }

                output.error = error.ToString();

                return output;
            });
        }

        public static string GetCategoryInfo(this ErrorRecord error)
        {
            var output = new StringBuilder();

            output.AppendLine($"Activity: {error.CategoryInfo.Activity}");
            output.AppendLine($"Category: {error.CategoryInfo.Category.ToString()}");
            output.AppendLine($"Reason: {error.CategoryInfo.Reason}");
            output.AppendLine($"TargetName: {error.CategoryInfo.TargetName}");

            return output.ToString();
        }
    }
}
